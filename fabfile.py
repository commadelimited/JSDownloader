from fabric.api import local, env


def start():
    local('foreman start')
