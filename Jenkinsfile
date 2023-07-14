pipeline {
  agent any
  stages {
    stage("verify tooling") {
      steps {
        sh '''
          docker version
          docker info
          docker compose version 
        '''
      }
    }
    stage('Shutdown Docker Compose') {
      steps {
        sh 'docker compose down'
      }
    }
    stage('Start container') {
      steps {
        sh 'docker-compose -f docker-compose.yml up --build -d'
        sh 'docker compose ps'
      }
    }
  }
}