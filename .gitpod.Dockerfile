FROM gitpod/workspace-full
USER gitpod
RUN sudo apt-get update -q && \
    sudo apt-get install -y uuid
#RUN sudo docker pull bitname/cosign:latest