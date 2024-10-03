import node from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'src/js/custom-d3.js',
    output: {
        file: 'src/js/custom-d3.umd.min.js',
        format: 'umd',
        name: 'd3'
    },
    plugins: [node(), uglify()]
};
