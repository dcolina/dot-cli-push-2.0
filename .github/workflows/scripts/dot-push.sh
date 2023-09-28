#!/bin/sh
  echo "Running dot-push action command"
  ## https://repo.dotcms.com/artifactory/libs-snapshot-local/com/dotcms/dotcms-cli/1.0.0-SNAPSHOT/dotcli-1.0.0-SNAPSHOT.jar
  CLI_RELEASE_DOWNLOAD_BASE_URL="https://repo.dotcms.com/artifactory/libs-snapshot-local/com/dotcms/dotcms-cli/"
  RUN_JAVA_VERSION=1.3.8
  RUN_DOT_CLI_VERSION='1.0.0-SNAPSHOT'
  CLI_RELEASE_DOWNLOAD_URL="${CLI_RELEASE_DOWNLOAD_BASE_URL}${RUN_DOT_CLI_VERSION}/dotcli-${RUN_DOT_CLI_VERSION}.jar"
  DOT_CLI_JAR="dot-cli.jar"
  DOT_CLI_HOME=/dot-cli/

  if [ ! -d "$DOT_CLI_HOME" ]; then
    mkdir $DOT_CLI_HOME
  fi

  # now lets get curl so we can download the CLI and the run-java.sh script
  apt-get update && \
    apt-get install -y curl && \
    apt-get clean;

chmod 777 "${DOT_CLI_HOME}${DOT_CLI_JAR}"

#Check the size of the file
file="${DOT_CLI_HOME}${DOT_CLI_JAR}" && \
    actual_size=$(wc -c <"$file");

  if (( "$actual_size" > 0 )); then \
     echo "dotcms-cli file size is $actual_size "; \
  else \
     echo "dot-CLI size is 0 bytes - Terminating program"; \
     exit 1; \
  fi

  echo "downloading dot CLI from ${CLI_RELEASE_DOWNLOAD_URL}"
  curl ${CLI_RELEASE_DOWNLOAD_URL} -L -o ${DOT_CLI_HOME}${DOT_CLI_JAR}

  echo "downloading run-java.sh"
  curl https://repo1.maven.org/maven2/io/fabric8/run-java-sh/${RUN_JAVA_VERSION}/run-java-sh-${RUN_JAVA_VERSION}-sh.sh -o "${DOT_CLI_HOME}"run-java.sh
  chmod 777 ${DOT_CLI_HOME}run-java.sh

  #Lets create the services file dot-service.yml
  #the services yml is used to store the server configurations or profiles if you Will
  USER_HOME="/root/"
  DOT_SERVICES_HOME=${USER_HOME}".dotcms/"
  DOT_SERVICE_YML=".dot-service.yml"
  SERVICE_FILE=$DOT_SERVICES_HOME$DOT_SERVICE_YML
# All we need is a file with an active profile that matches the server we want to connect to in this case we are using default
services_file_content='name: "default"
active: true'

  if [ ! -d "$DOT_SERVICES_HOME" ]; then
    mkdir $DOT_SERVICES_HOME
    echo "Creating services file: $SERVICE_FILE";
    echo "$services_file_content" >> "$SERVICE_FILE";
    cat "$SERVICE_FILE";
  fi

  #Tell the CLI to use the demo server through the profile "default"
  #The suffix value used to create the environment value must match the name on dot-service.yml file in this case we are using default
  #dotcms.client.servers.default=https://demo.dotcms.com/api
  DEMO_API_URL="https://demo.dotcms.com/api"
  DOTCMS_CLIENT_SERVERS_DEFAULT=$DOT_API_URL
  DOTCMS_CLIENT_SERVERS_DEFAULT=${DOTCMS_CLIENT_SERVERS_DEFAULT:-$DEMO_API_URL}


  #These environment vars are expected by the start-up script
  export JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
  # This is a relative path to the run-java.sh file, both the jar and script are expected to live in the same folder
  export JAVA_APP_JAR="${DOT_CLI_JAR}"
  # This is the name of the process that will be used to identify the process in the container
  export JAVA_APP_NAME="dotcms-cli"
  # Log file
  export QUARKUS_LOG_FILE_PATH=${DOT_CLI_HOME}"dotcms-cli.log"
  bash /dot-cli/run-java.sh "$@"
  exit_code=$?

  echo "exit_code=$exit_code" >> "$GITHUB_OUTPUT"

  echo "Quarkus log file contents:"
  cat "${QUARKUS_LOG_FILE_PATH}"