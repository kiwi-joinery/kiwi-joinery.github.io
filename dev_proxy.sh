if cat /proc/version | grep microsoft; then
  CMD="cmd.exe /c"
  PWD=$(wslpath -w $(pwd))
else
  CMD=
  PWD=$(pwd)
fi

set -e
$CMD docker run -it --rm -p 8002:80 -v $PWD:/usr/share/nginx/html -v $PWD/nginx:/etc/nginx:ro nginx
