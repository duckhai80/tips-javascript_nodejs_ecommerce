sudo apt-get update
sudo apt-get install nginx
sudo systemctl status nginx

### Config Nginx

location /api {
rewrite ^\/api\/(.\*)$ /api/$1 break;
proxy_pass http://localhost:3000;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

### Add domain to nginx configuration

server_name ecommerce.duckhai80.com www.ecommerce.duckhai80.com;
location / {
proxy_pass http://localhost:3000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
}

### Add SSL to domain

sudo dnf install -y python3 augeas-libs
sudo dnf remove certbot -y
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
sudo /opt/certbot/bin/certbot --nginx -d ecommerce.duckhai80.com
sudo /opt/certbot/bin/certbot renew --dry-run
sudo systemctl status certbot.timer
