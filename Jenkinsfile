pipeline {
    agent any

    environment {
        EC2_USER_HOST = 'ubuntu@13.232.74.144'
    }

    def url = 'https://api.envision.webcluesstaging.com/'

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

    post {
        always {
            slackSend(
                channel: 'proj-envision',
                message: "Build: *${currentBuild.result}:* JOB ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL} \n Web-Site URL: ${url}",
                color: COLOR_MAP[currentBuild.result]
            )

            emailext(
                subject: "Build Succeeded: ${JOB_NAME}-Build# ${BUILD_NUMBER} ${currentBuild.result}",
                body: "${currentBuild.result}: ${BUILD_URL}",
                attachLog: true,
                compressLog: true,
                replyTo: 'harsh.solanki@codezeros.com',
                to: 'harsh.solanki@codezeros.com'
            )
        }
    }
}
