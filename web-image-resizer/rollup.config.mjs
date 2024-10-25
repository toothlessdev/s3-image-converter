import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

/** @type {import("rollup").RollupOptions} */
export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/cjs/index.js",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "dist/esm/index.js",
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [typescript()],
    },
    {
        input: "dist/esm/index.d.ts",
        ouptut: {
            file: "dist/index.d.ts",
        },
        plugins: [dts()],
    },
];
