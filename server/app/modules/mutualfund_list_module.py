import pandas as pd
import os

class DataService:
    @staticmethod
    def get_top_schemes(file_path="MF_India_AI.csv", limit=20):
        try:
            if not os.path.exists(file_path):
                return [{"error": "CSV file not found"}]

            df = pd.read_csv(file_path)

            df_filtered = df.iloc[:500]
            df_random = df_filtered.sample(n=min(limit, len(df_filtered)))

            return df_random.fillna("").to_dict(orient="records")

        except Exception as e:
            return [{"error": str(e)}]
