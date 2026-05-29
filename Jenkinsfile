pipeline {
    agent any

    environment {
        SONAR_SCANNER = tool 'sonar-scanner'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/hhvnagasai/hari-event.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                    $SONAR_SCANNER/bin/sonar-scanner \
                    -Dsonar.projectName=meghana-pro \
                    -Dsonar.projectKey=meghana-pro \
                    -Dsonar.sources=. 
                    '''
                }
            }
        }

        stage('OWASP Dependency Check') {
    steps {
        withCredentials([
            string(
                credentialsId: 'NVD_API_KEY',
                variable: 'NVD_API_KEY'
            )
        ]) {
            dependencyCheck(
                odcInstallation: 'owasp',
                additionalArguments: """
                    --nvdApiKey ${NVD_API_KEY}
                    --scan .
                    --format HTML
                """
            )
        }
    }
}

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t meghana-backend:v1 .'
                }
            }
        }

         stage('Trivy Backend Scan') {
    steps {
        sh '''
        trivy fs . \
        --severity HIGH,CRITICAL \
        --exit-code 0
        '''
    }
}
            }

stage('Push Backend Image') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )
        ]) {
            sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

            docker tag meghana-backend:v1 hhvnagasai/meghana-backend:v1

            docker push hhvnagasai/meghana-backend:v1
            '''
        }
    }
}
stage('Build Frontend Docker Image') {
    steps {
        dir('frontend') {
            sh 'docker build -t meghana-frontend:v1 .'
        }
    }
}

stage('Push Frontend Image') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )
        ]) {
            sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

            docker tag meghana-frontend:v1 hhvnagasai/meghana-frontend:v1

            docker push hhvnagasai/meghana-frontend:v1
            '''
        }
    }
}
}
