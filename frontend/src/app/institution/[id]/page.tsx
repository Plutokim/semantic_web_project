"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { institutionApi } from "~/api/institutionApi";
import type { Institution } from "~/types/institution";
import styles from "./page.module.css";

export default function InstitutionPage() {
  const params = useParams();
  const router = useRouter();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemId = params?.id as string;

  useEffect(() => {
    async function loadInstitution() {
      if (!itemId) {
        setError("Invalid institution ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await institutionApi.getById(itemId);
        if (data) {
          setInstitution(data);
        } else {
          setError("Institution not found");
        }
      } catch (err) {
        setError("Failed to load institution");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadInstitution();
  }, [itemId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Помилка</h2>
          <p>{error || "Заклад не знайдено"}</p>
          <Link href="/" className={styles.backLink}>
            ← Повернутися до списку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Повернутися до списку
      </Link>

      <article className={styles.institution}>
        <header className={styles.header}>
          {institution.image !== null && 
           institution.image !== undefined && 
           institution.image !== '' && (
            <div className={styles.imageContainer}>
              <img
                src={institution.image}
                alt={institution.itemLabel || 'Institution image'}
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{institution.itemLabel || 'Назва не вказана'}</h1>
            <div className={styles.chips}>
              {institution.locationLabel !== null && 
               institution.locationLabel !== undefined && 
               institution.locationLabel !== '' && (
                <span className={`${styles.chip} ${styles.city}`}>
                  {institution.locationLabel}
                </span>
              )}
              {institution.typeLabel !== null && 
               institution.typeLabel !== undefined && 
               institution.typeLabel !== '' && (
                <span className={`${styles.chip} ${styles.type}`}>
                  {institution.typeLabel}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className={styles.details}>
          {institution.founded !== null && 
           institution.founded !== undefined && 
           institution.founded !== '' && (
            <div className={styles.detailItem}>
              <h3 className={styles.detailLabel}>Рік заснування</h3>
              <p className={styles.detailValue}>
                {(() => {
                  try {
                    const date = new Date(institution.founded);
                    return isNaN(date.getTime()) 
                      ? institution.founded 
                      : date.getFullYear();
                  } catch {
                    return institution.founded;
                  }
                })()}
              </p>
            </div>
          )}

          {institution.studentCount !== null && 
           institution.studentCount !== undefined && 
           typeof institution.studentCount === 'number' && (
            <div className={styles.detailItem}>
              <h3 className={styles.detailLabel}>Кількість студентів</h3>
              <p className={styles.detailValue}>
                {institution.studentCount.toLocaleString()}
              </p>
            </div>
          )}

          {institution.address !== null && 
           institution.address !== undefined && 
           institution.address !== '' && (
            <div className={styles.detailItem}>
              <h3 className={styles.detailLabel}>Адреса</h3>
              <p className={styles.detailValue}>{institution.address}</p>
            </div>
          )}

          {institution.coordinate !== null && 
           institution.coordinate !== undefined && 
           institution.coordinate !== '' && (() => {
            const coordMatch = institution.coordinate.match(/Point\(([\d.]+)\s+([\d.]+)\)/);
            if (coordMatch) {
              const longitude = parseFloat(coordMatch[1]);
              const latitude = parseFloat(coordMatch[2]);
              const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed&z=15`;
              
              return (
                <div className={styles.detailItem}>
                  <h3 className={styles.detailLabel}>Розташування</h3>
                  <div className={styles.mapContainer}>
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className={styles.map}
                      title="Map location"
                    />
                    <a
                      href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapLink}
                    >
                      Відкрити в Google Maps
                    </a>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {institution.website !== null && 
           institution.website !== undefined && 
           institution.website !== '' && (
            <div className={styles.detailItem}>
              <h3 className={styles.detailLabel}>Веб-сайт</h3>
              <a
                href={institution.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                {institution.website}
              </a>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

