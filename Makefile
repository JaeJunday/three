# 도커컴포즈 의존성
all:
	docker compose up --build

# 도커 명령어
down: 
	docker-compose down
	rm -rf $(NAME)

clean:
	make down
	docker system prune -af

fclean:
	make clean
	docker volume rm $$(docker volume ls -q -f dangling=true) || docker volume ls

re:
	make fclean
	make all

.phony: down clean fclean re