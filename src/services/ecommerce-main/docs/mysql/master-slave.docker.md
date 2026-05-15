docker run -d --name ecommerce-mysql -e MYSQL_ROOT_PASSWORD=starter80 -v ecommerce-db-data:/var/lib/mysql -p 3306:3306 mysql:8.0

docker network create ecommerce-net

docker run -d --name ecommerce-mysql-master --network ecommerce-net -p 8811:3306 -e MYSQL_ROOT_PASSWORD=starter80 mysql:8.0
docker run -d —name ecommerce-mysql-slave —network ecommerce-net -p 8822:3306 -e MYSQL_ROOT_PASSWORD=starter80 mysql:8.0

config my.cnf của master và slave.

change master to
master_host=‘172.19.0.2’,
master_port=3306,
master_user=‘root’,
master_password=‘starter80’,
master_log_file=‘ecommerce-master-bin.000001’,
master_log_pos=157,
master-connect-retry=60,
GET_MASTER_PUBLIC_KEY=1;

create user ‘duckhai80’@‘%’ identified by ‘starter80’;
grant all privileges on ecommerce_dev.\* to ‘duckhai80’;
