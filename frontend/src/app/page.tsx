import { institutionApi } from "~/api/institutionApi";
import MainScreen from "~/screens/MainScreen/MainScreen";

export default async function Home() {
  const institutions = await institutionApi.all();
  return <MainScreen institutions={institutions} />;
}
