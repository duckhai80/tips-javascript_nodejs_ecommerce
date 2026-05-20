### Install Certbot

sudo amazon-linux-extras install epel -y

sudo dnf install python3 augeas-libs -y
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot

### Install MySQL

sudo dnf install https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm -y
sudo dnf install mysql-community-server -y

### Update GPG key

sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023

### Enable MySQL

sudo systemctl enable mysqld

### Start MySQL

sudo systemctl start mysqld

### Get password MySQL

sudo cat /var/log/mysqld.log | grep "temporary password"


### Copy MySQL dump file
scp -i ~/".ssh/ecommerce-mysql-server-key-pair.pem" ~/Downloads/mysqlsampledatabase.sql ec2-user@ec2-13-214-128-77.ap-southeast-1.compute.amazonaws.com:~/