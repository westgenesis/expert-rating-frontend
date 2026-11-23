docker buildx build --platform linux/amd64 --load -t expert-rating-frontend:latest .
docker save -o expert-rating-frontend.tar expert-rating-frontend:latest