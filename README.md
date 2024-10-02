# Simulador de políticas fiscales

# Development

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production, and deploy to GithubPages

```
yarn deploy
```

# Data from FRP

El fichero **simulation-all.csv** es de generación manual, a base de copiar los valores para cada simulación en la linea correspondiente. Te puedes ayudar con el modo columna del editor, para ir pegando en grupos de 4 (los años dados).

Una vez tengamos **simulation-all.csv**, ejecuta estando en esta carpeta, los siguientes comandos:

```bash
$ awk 'NR>1 {print > ("src/csv/" $1 "/" $2 ".csv")}' FS=, src/csv/simulation-all.csv
$ for i in src/csv/empleo/*csv src/csv/pib/*csv; do sed -i '1i '$(head -n1 src/csv/simulation-all.csv) $i; done
$ rm src/csv/empleo/prevision.csv src/csv/pib/prevision.csv
```

Esto creará todos los pequeños CSV de las carpetas empleo y pib
