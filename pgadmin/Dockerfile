# Use the official PgAdmin image as base
FROM dpage/pgadmin4

# Set environment variables (optional, can also be in docker-compose.yml)
ENV PGADMIN_DEFAULT_EMAIL=admin@bookline.com
ENV PGADMIN_DEFAULT_PASSWORD=admin
ENV PGADMIN_LISTEN_PORT=80

# Copy the .pgpass file
COPY .pgpass /var/lib/pgadmin/.pgpass
# Copy servers.json to configure PgAdmin
COPY servers.json /pgadmin4/servers.json

# Expose PgAdmin port
EXPOSE 80

# Start PgAdmin
CMD ["/entrypoint.sh"]
