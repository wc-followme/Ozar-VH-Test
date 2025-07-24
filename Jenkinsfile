pipeline {
    agent any

    environment {
        EC2_USER_HOST = 'ubuntu@13.232.74.144'
    }

    stages {
        stage('Run Deployment Script on Staging EC2') {
            steps {
                sshagent(credentials: ['envision-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $EC2_USER_HOST << 'EOF'
                        bash /home/ubuntu/scripts/backend-deploy.sh
                    EOF
                    """
                }
            }
        }
    }
}
