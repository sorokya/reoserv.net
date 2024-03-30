export function meta() {
  return [{ title: 'Downloads | REOSERV' }];
}

export default function Downloads() {
  return (
    <>
      <h1 className="font-bold text-2xl">Downloads</h1>
      <p>There are no binary downloads available for REOSERV yet!</p>

      <p className="m-1">
        <em>Hovever</em>, there is a docker image published at the GitHub
        Container Registry.
      </p>

      <p className="m-1">
        <h2 className="font-bold text-xl">
          Recommended setup with docker compose:
        </h2>
        <h3 className="text-lg">1. Clone the repository</h3>
        <pre className="border-black bg-gray-200 p-1">
          git clone https://github.com/sorokya/reoserv.git
        </pre>
        <h3 className="text-lg">2. Add your pub and map files</h3>
        <h3 className="text-lg">3. Create the .env file and edit values</h3>
        <pre className="border-black bg-gray-200 p-1">
          {`cp .env.example .env
nvim .env`}
        </pre>
        <h3 className="text-lg">4. Create docker-compose.yml</h3>
        <pre className="border-black bg-gray-200 p-1">
          {`version: '3.8'

services:
  reoserv:
    image: ghcr.io/sorokya/reoserv:master
    ports:
      - 8078:8078
    volumes:
      - ./:/reoserv
    depends_on:
      db:
        condition: service_healthy
  db:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_USER: reoserv
      MYSQL_DATABASE: reoserv
      MYSQL_PASSWORD: \${MYSQL_REOSERV_PASSWORD}
      TZ: UTC
    ports:
      - 3306:3306
    volumes:
      - ./db-init/:/docker-entrypoint-initdb.d/
    healthcheck:
      test: mysqladmin ping -h 127.0.0.1 -u $$MYSQL_USER --password=$$MYSQL_PASSWORD
      start_period: 5s
      interval: 5s
      timeout: 5s
      retries: 5`}
        </pre>
        <h3 className="text-lg">5. Update config</h3>
        <pre className="border-black bg-gray-200 p-1">
          {`cp Config.toml Config.local.toml
nvim Config.local.toml`}
        </pre>
        <pre className="p1 mt-1 border-black bg-gray-200">
          {`[database]
host = "db"
port = "3306"
name = "reoserv"
username = "reoserv"
password = "<SAME PASSWORD FROM .env>"`}
        </pre>
        <h3 className="text-lg">6. Start reoserv</h3>
        <pre className="border-black bg-gray-200 p-1">docker compose up</pre>
      </p>
    </>
  );
}
