start:
	docker build -t find-mask:dev . && docker run -v ${PWD}:/app -v /app/node_modules -p 3001:3000 --rm find-mask:dev

stop:
	docker rmi -f find-mask:dev

start-prod:
	docker build -f Dockerfile-prod -t find-mask:prod . && docker run -it -p 80:80 --rm find-mask:prod

stop-prod:
	docker rmi -f find-mask:prod
