pipeline {
    agent any 
    stages {
        stage ('Build') {
            steps {
                agent {
                    docker {
                        image 'node:18-alpine'
                        reuseNode true
                    }
                }
                steps {
                    sh '''
                        la -l 
                        node --version
                        npm --version
                        npm install
                        npm run build
                        la -l
                    '''
                }
            }
        }
    }
}