pipeline {
    agent any

    stages {
        stage('Build with Docker') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        sh '''
                            node --version
                            npm --version
                            npm install
                            npm run build
                        '''
                    }
                }
            }
        }
    }
}
