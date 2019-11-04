

## Calculate absolute Empleo

Depencies: bash4.0

`simulacion-empleo.sh`

First we have to calculate the amount of the percentage. To do this, we multiply the percentage by the prevision and divide it by 100, this gives us the absolute figure, which I am now rounded. We sum this figure to the prevision to obtain the total value. We write all these data in simulacion-empleo.csv

## Build datasets

Depencies: bash4.0 - sed - [csvkit](https://github.com/wireservice/csvkit)

`build-datasets.sh`

To build each dataset. We divide simulacion-empleo.csv with all absolute figures by four rows. Now we make each dataset with four columns, one for the years (2019,2020, 2021, 2022), another column for the prevision, another column for the absolute data of the simulation, and the last column for the data of the percentage of the simulation. And we give each of these files their respective names, for example, the first file corresponds to the combination (pf-1-idc-1-vdc-1), which is as if the user had selected the first radio-button of each selector.
