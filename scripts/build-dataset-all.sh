#!/usr/local/bin/bash

readarray -t fileName < ~/populate/frp-simulacion/scripts/names-datasets.csv

names=('empleo00' 'empleo01' 'empleo02' 'empleo03' 'empleo04' 'empleo05' 'empleo06' 'empleo07' 'empleo08' 'empleo09' 'empleo10' 'empleo11' 'empleo12' 'empleo13' 'empleo14' 'empleo15' 'empleo16' 'empleo17' 'empleo18' 'empleo19' 'empleo20' 'empleo21' 'empleo22' 'empleo23' 'empleo24' 'empleo25' 'empleo26' 'empleo27' 'empleo28' 'empleo29' 'empleo30' 'empleo31')

namesFilter=('names-dataset00' 'names-dataset01' 'names-dataset02' 'names-dataset03' 'names-dataset04' 'names-dataset05' 'names-dataset06' 'names-dataset07' 'names-dataset08' 'names-dataset09' 'names-dataset10' 'names-dataset11' 'names-dataset12' 'names-dataset13' 'names-dataset14' 'names-dataset15' 'names-dataset16' 'names-dataset17' 'names-dataset18' 'names-dataset19' 'names-dataset20' 'names-dataset21' 'names-dataset22' 'names-dataset23' 'names-dataset24' 'names-dataset25' 'names-dataset26' 'names-dataset27' 'names-dataset28' 'names-dataset29' 'names-dataset30' 'names-dataset31')

for (( i=0; i<${#names[@]}; ++i )); do

    csvjoin -u 1 ~/populate/frp-simulacion/scripts/names-datasets/"${namesFilter[$i]}" ~/populate/frp-simulacion/scripts/years-empleo.csv ~/populate/frp-simulacion/scripts/prevision-empleo-unique.csv ~/populate/frp-simulacion/scripts/simulacion-split/simulacion-"${names[$i]}" ~/populate/frp-simulacion/scripts/percentage-split/percentage-"${names[$i]}" >> ~/populate/frp-simulacion/scripts/simulation-empleo-all.csv


done

sed -i '1s/^/filter,year,prevision,simulacionpib,simulacionpercentage\n/' ~/populate/frp-simulacion/scripts/simulation-empleo-all.csv


