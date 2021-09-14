// rollup对css的引用打包后会挂载到html中，我们的库需要保持js文件中对css的引用
export default function addCssImport() {
    return {
        name: 'rollup-plugin-add-css-import',
        generateBundle (_, bundle) {
            bundle['index.js'].code = "import './style/index.css';\r\n" + bundle['index.js'].code
        }
        // 文档上的这个生命周期不调用
        // moduleParsed(moduleInfo) {
        //     console.log(moduleInfo, '*-*-*-*-*-*-*-');
        // }
    }
}