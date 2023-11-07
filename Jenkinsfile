pipeline {
    agent {
        docker {
            image 'node:20.9.0-alpine3.18'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/mikefarquhar/learning-devops.git'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
                sh 'ls ./dist'
            }
        }
    }
}