from datasource.fuseki.source import Fuseki


class Migrator:
    """Міграція\ініціалізація схеми даних для Fuseki"""

    def __init__(self, client: Fuseki):
        self.client = client

    def check_if_exists(self, ds_name: str):
        """Перевірка наявності датасету з певним іменем"""

        datasets = []
        try:
            datasets = self.client.list_datasets()
        except Exception as e:
            raise Exception(f"Error listing datasets: {str(e)}")

        for ds in datasets:
            if ds.get("ds.name") == f"/{ds_name}":
                return True
        return False

    def create_dataset(self, ds_name: str, ds_type: str = "mem"):
        """Створення датасету якщо він не існує"""

        print(f"Creating dataset '{ds_name}'...")
        if self.check_if_exists(ds_name):
            print(f"Dataset '{ds_name}' already exists")
            return
        try:
            self.client.create_dataset(ds_name, ds_type)
            print(f"Dataset '{ds_name}' created successfully")
        except Exception as e:
            raise Exception(f"Error creating dataset: {str(e)}")


def new_migrator(client: Fuseki):
    """Фабрична функція"""

    return Migrator(client)
