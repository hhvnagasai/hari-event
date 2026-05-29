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
                dependencyCheck additionalArguments: '''
		--nvdApiKey $NVD_API_KEY
		--scan .
		''', 
		odcInstallation: 'owasp'
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
        }
    }
}
