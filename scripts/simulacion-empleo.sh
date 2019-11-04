#!/usr/local/bin/bash

readarray -t porcentaje < ~/populate/frp-simulacion/scripts/percentage-empleo.csv
readarray -t prevision < ~/populate/frp-simulacion/scripts/prevision-empleo.csv

for (( i=0; i<${#porcentaje[@]}; ++i )); do

    resultado=$(echo "scale=4; ${porcentaje[$i]}*${prevision[$i]}/100" | bc)

    total=$(echo "scale=4; $resultado+${prevision[$i]}" | bc | awk '{print ($0-int($0)<0.499)?int($0):int($0)+1}' >> simulacion-empleo.csv)

done



