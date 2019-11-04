#!/usr/local/bin/bash

readarray -t fileName < ~/populate/frp-simulacion/scripts/names-datasets.csv

names=('empleo00' 'empleo01' 'empleo02' 'empleo03' 'empleo04' 'empleo05' 'empleo06' 'empleo07' 'empleo08' 'empleo09' 'empleo10' 'empleo11' 'empleo12' 'empleo13' 'empleo14' 'empleo15' 'empleo16' 'empleo17' 'empleo18' 'empleo19' 'empleo20' 'empleo21' 'empleo22' 'empleo23' 'empleo24' 'empleo25' 'empleo26' 'empleo27' 'empleo28' 'empleo29' 'empleo30' 'empleo31')

for (( i=0; i<${#names[@]}; ++i )); do

    csvjoin -u 1 ~/populate/frp-simulacion/scripts/years-empleo.csv ~/populate/frp-simulacion/scripts/prevision-empleo-unique.csv ~/populate/frp-simulacion/scripts/simulacion-split/simulacion-"${names[$i]}" ~/populate/frp-simulacion/scripts/percentage-split/percentage-"${names[$i]}"> ~/populate/frp-simulacion/scripts/datasets/"${fileName[$i]}"

    sed -i '1s/^/year,prevision,simulacionpib,simulacionpercentage\n/' ~/populate/frp-simulacion/scripts/datasets/"${fileName[$i]}"

done



