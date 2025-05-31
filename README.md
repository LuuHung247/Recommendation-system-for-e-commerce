# Recommendation-system-for-e-commerce

A scalable recommendation system for e-commerce using Apache Spark on Google Cloud Platform (GCP), combining collaborative filtering (ALS) and content-based filtering.

## Tech Stack

- **Compute Engine for Spark:** Apache Spark on Google Cloud Dataproc
- **Data Lake Storage:** Google Cloud Storage (GCS)
- **Data Warehouse (Optional):** Google BigQuery
- **Feature Store/Real-time Lookups (External):** MongoDB Atlas
- **Programming Language & Libraries:** PySpark, Hugging Face `datasets`
- **Development Environment:** Jupyter Notebook (via Dataproc Component Gateway)

## Deployment on Google Cloud Platform (GCP)

### Project Setup

- Create a new GCP project or select an existing one.
- Record your **Project ID**.
- Enable the following APIs for your project through the GCP Console or `gcloud`:

  - `Dataproc API` (dataproc.googleapis.com)
  - `Compute Engine API` (compute.googleapis.com)
  - `Cloud Storage API` (storage.googleapis.com)
  - `BigQuery API` (bigquery.googleapis.com) (if you plan to use BigQuery)
  - `Cloud Shell API` (cloudshell.googleapis.com) (recommended for easy `gcloud` access)
  - `IAM API` (iam.googleapis.com) (for managing permissions)

  You can enable APIs using `gcloud` like this:

  ```bash
  gcloud services enable dataproc.googleapis.com \
      compute.googleapis.com \
      storage.googleapis.com \
      bigquery.googleapis.com \
      cloudshell.googleapis.com \
      iam.googleapis.com --project=YOUR_PROJECT_ID
  ```

### Create Cloud Storage Bucket

You can use the GCP Console or run the following in Cloud Shell:

```bash
gsutil mb -p bigdataproject-456014 -l asia-southeast1 -c STANDARD gs://team15-bucket/

```

### Create Dataproc Cluster with Spark + Jupyter

Run this in Google Cloud Shell to create a Dataproc cluster with Jupyter support:

```bash
gcloud dataproc clusters create team15-cluster \
--enable-component-gateway \
--region asia-southeast1 \
--master-machine-type n2-highmem-4 \
--master-boot-disk-type pd-standard \
--master-boot-disk-size 64 \
--num-workers 2 \
--worker-machine-type c2d-highmem-4 \
--worker-boot-disk-type pd-standard \
--worker-boot-disk-size 64 \
--image-version 2.1-ubuntu20 \
--optional-components=JUPYTER \
--project bigdataproject-456014 \
--properties spark:spark.executor.cores=4,spark:spark.executor.memory=25g,spark:spark.driver.memory=25g,spark:spark.sql.shuffle.partitions=100,spark:spark.kryoserializer.buffer.max=1024m,spark:spark.kryoserializer.buffer=64m

```

### Create Dataproc Cluster with Spark + Jupyter

You can use the GCP Console or run the following in Cloud Shell:

```bash
bq --location=asia-southeast1 mk --dataset bigdataproject-456014:team15_dataset

```
