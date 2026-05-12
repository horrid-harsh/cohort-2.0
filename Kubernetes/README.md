# Kubernetes Workflow

This document explains the Kubernetes deployment and autoscaling workflow in a beginner-friendly way. It covers:

- **Dockerization**: Containerizing the Node.js backend using a Dockerfile.
- **Deployment**: Defining how the application runs in the cluster using `deployment.yml`.
- **Service**: Exposing the application internally using `service.yml`.
- **Ingress**: Routing external traffic to the service via `ingress.yml`.
- **Autoscaling**: Testing Horizontal Pod Autoscaling (HPA) to handle varying loads.

## Project Structure
- `Backend/`: Contains the source code and Dockerfile.
- `Backend/k8s/`: Contains the Kubernetes manifest files.
