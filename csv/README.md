El fichero **simulation-all.csv** es de generación manual, a base de copiar los valores para cada simulación en la linea correspondiente. Te puedes ayudar con el modo columna del editor, para ir pegando en grupos de 4 (los años dados).

Una vez tengamos **simulation-all.csv**, ejecuta en esta carpeta:

```bash
$ awk 'NR>1 {print > ($1 "/" $2 ".csv")}' FS=, simulation-all.csv
$ for i in empleo/*csv pib/*csv; do sed -i '1i '$(head -n1 simulation-all.csv) $i; done
$ rm empleo/prevision.csv pib/prevision.csv
```

Esto creará todos los pequeños CSV de las carpetas empleo y pib
