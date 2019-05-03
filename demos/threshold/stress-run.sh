#!/bin/bash

node server.js "suppress" &

for (( i=1; i<=$1; i++ ))
do
    node party.js $i $(( $1 / 2 )) $1 $2 "stress-test" $i "suppress" &
    pids[${i}]=$!
done

for (( i=1; i<=$2; i++ ))
do
    node party.js 0 $(( $1 / 2 )) $1 $2 "stress-test" $(( $1 + i )) "suppress" &
     pids[${i}]=$!
done

# wait for all parties
for pid in ${pids[*]}; do
    wait $pid
done

echo "Result should be $(( ($1 + 1) / 2 ))"
kill $(ps aux | grep "node server\.js" | awk '{ print $2 }') >/dev/null 2>&1
