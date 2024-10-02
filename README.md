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

### Compiles and minifies for production

```
yarn build
```

# Data from FRP

El fichero **simulation-all.csv** es de generación manual, a base de copiar los valores para cada simulación en la linea correspondiente. Te puedes ayudar con el modo columna del editor, para ir pegando en grupos de 4 (los años dados).

Una vez tengamos **simulation-all.csv**, ejecuta estando en esta carpeta, los siguientes comandos:

```bash
$ awk 'NR>1 {print > ("csv/" $1 "/" $2 ".csv")}' FS=, csv/simulation-all.csv
$ for i in csv/empleo/*csv csv/pib/*csv; do sed -i '1i '$(head -n1 csv/simulation-all.csv) $i; done
$ rm csv/empleo/prevision.csv csv/pib/prevision.csv
```

Esto creará todos los pequeños CSV de las carpetas empleo y pib
