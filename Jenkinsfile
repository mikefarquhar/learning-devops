pipeline {
    agent {
        docker {
            image 'node:20.9.0-alpine3.18'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/mikefarquhar/learning-devops.git'
                    branch: 'main'

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