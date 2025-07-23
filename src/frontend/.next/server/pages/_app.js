/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./context/CarrinhoContext.tsx":
/*!*************************************!*\
  !*** ./context/CarrinhoContext.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CarrinhoProvider: () => (/* binding */ CarrinhoProvider),\n/* harmony export */   useCarrinho: () => (/* binding */ useCarrinho)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst CarrinhoContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst CarrinhoProvider = ({ children })=>{\n    const [carrinho, setCarrinho] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const armazenado = localStorage.getItem(\"carrinho\");\n        if (armazenado) {\n            setCarrinho(JSON.parse(armazenado));\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        localStorage.setItem(\"carrinho\", JSON.stringify(carrinho));\n    }, [\n        carrinho\n    ]);\n    const adicionarProduto = (id)=>{\n        setCarrinho((prev)=>{\n            const existente = prev.find((p)=>p.id === id);\n            if (existente) {\n                return prev.map((p)=>p.id === id ? {\n                        ...p,\n                        quantidade: p.quantidade + 1\n                    } : p);\n            }\n            return [\n                ...prev,\n                {\n                    id,\n                    quantidade: 1\n                }\n            ];\n        });\n    };\n    const adicionarProdutoQuantidade = (id, quantidade)=>{\n        setCarrinho((carrinhoAtual)=>{\n            const existente = carrinhoAtual.find((item)=>item.id === id);\n            if (existente) {\n                // Atualiza a quantidade do produto já existente\n                return carrinhoAtual.map((item)=>item.id === id ? {\n                        ...item,\n                        quantidade: item.quantidade + quantidade\n                    } : item);\n            } else {\n                // Adiciona novo produto ao carrinho\n                return [\n                    ...carrinhoAtual,\n                    {\n                        id,\n                        quantidade\n                    }\n                ];\n            }\n        });\n    };\n    const removerProduto = (id)=>{\n        setCarrinho((prev)=>prev.filter((p)=>p.id !== id));\n    };\n    const limparCarrinho = ()=>{\n        setCarrinho([]);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CarrinhoContext.Provider, {\n        value: {\n            carrinho,\n            adicionarProduto,\n            removerProduto,\n            limparCarrinho,\n            adicionarProdutoQuantidade\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\gusta\\\\Projetos\\\\cafe-america-clone\\\\src\\\\frontend\\\\context\\\\CarrinhoContext.tsx\",\n        lineNumber: 70,\n        columnNumber: 5\n    }, undefined);\n};\nconst useCarrinho = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CarrinhoContext);\n    if (!context) throw new Error(\"useCarrinho deve ser usado dentro de CarrinhoProvider\");\n    return context;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L0NhcnJpbmhvQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUF1RTtBQWV2RSxNQUFNSSxnQ0FBa0JKLG9EQUFhQSxDQUFrQ0s7QUFFaEUsTUFBTUMsbUJBQW1CLENBQUMsRUFBRUMsUUFBUSxFQUFpQztJQUMxRSxNQUFNLENBQUNDLFVBQVVDLFlBQVksR0FBR04sK0NBQVFBLENBQWlCLEVBQUU7SUFFM0RELGdEQUFTQSxDQUFDO1FBQ1IsTUFBTVEsYUFBYUMsYUFBYUMsT0FBTyxDQUFDO1FBQ3hDLElBQUlGLFlBQVk7WUFDZEQsWUFBWUksS0FBS0MsS0FBSyxDQUFDSjtRQUN6QjtJQUNGLEdBQUcsRUFBRTtJQUVMUixnREFBU0EsQ0FBQztRQUNSUyxhQUFhSSxPQUFPLENBQUMsWUFBWUYsS0FBS0csU0FBUyxDQUFDUjtJQUNsRCxHQUFHO1FBQUNBO0tBQVM7SUFFYixNQUFNUyxtQkFBbUIsQ0FBQ0M7UUFDeEJULFlBQVlVLENBQUFBO1lBQ1YsTUFBTUMsWUFBWUQsS0FBS0UsSUFBSSxDQUFDQyxDQUFBQSxJQUFLQSxFQUFFSixFQUFFLEtBQUtBO1lBQzFDLElBQUlFLFdBQVc7Z0JBQ2IsT0FBT0QsS0FBS0ksR0FBRyxDQUFDRCxDQUFBQSxJQUNkQSxFQUFFSixFQUFFLEtBQUtBLEtBQUs7d0JBQUUsR0FBR0ksQ0FBQzt3QkFBRUUsWUFBWUYsRUFBRUUsVUFBVSxHQUFHO29CQUFFLElBQUlGO1lBRTNEO1lBQ0EsT0FBTzttQkFBSUg7Z0JBQU07b0JBQUVEO29CQUFJTSxZQUFZO2dCQUFFO2FBQUU7UUFDekM7SUFDRjtJQUVBLE1BQU1DLDZCQUE2QixDQUFDUCxJQUFZTTtRQUM5Q2YsWUFBWSxDQUFDaUI7WUFDWCxNQUFNTixZQUFZTSxjQUFjTCxJQUFJLENBQUNNLENBQUFBLE9BQVFBLEtBQUtULEVBQUUsS0FBS0E7WUFDekQsSUFBSUUsV0FBVztnQkFDYixnREFBZ0Q7Z0JBQ2hELE9BQU9NLGNBQWNILEdBQUcsQ0FBQ0ksQ0FBQUEsT0FDdkJBLEtBQUtULEVBQUUsS0FBS0EsS0FDUjt3QkFBRSxHQUFHUyxJQUFJO3dCQUFFSCxZQUFZRyxLQUFLSCxVQUFVLEdBQUdBO29CQUFXLElBQ3BERztZQUVSLE9BQU87Z0JBQ0wsb0NBQW9DO2dCQUNwQyxPQUFPO3VCQUFJRDtvQkFBZTt3QkFBRVI7d0JBQUlNO29CQUFXO2lCQUFFO1lBQy9DO1FBQ0Y7SUFDRjtJQUVBLE1BQU1JLGlCQUFpQixDQUFDVjtRQUN0QlQsWUFBWVUsQ0FBQUEsT0FBUUEsS0FBS1UsTUFBTSxDQUFDUCxDQUFBQSxJQUFLQSxFQUFFSixFQUFFLEtBQUtBO0lBQ2hEO0lBRUEsTUFBTVksaUJBQWlCO1FBQ3JCckIsWUFBWSxFQUFFO0lBQ2hCO0lBRUEscUJBQ0UsOERBQUNMLGdCQUFnQjJCLFFBQVE7UUFDdkJDLE9BQU87WUFBRXhCO1lBQVVTO1lBQWtCVztZQUFnQkU7WUFBZ0JMO1FBQTJCO2tCQUUvRmxCOzs7Ozs7QUFHUCxFQUFFO0FBRUssTUFBTTBCLGNBQWM7SUFDekIsTUFBTUMsVUFBVWpDLGlEQUFVQSxDQUFDRztJQUMzQixJQUFJLENBQUM4QixTQUFTLE1BQU0sSUFBSUMsTUFBTTtJQUM5QixPQUFPRDtBQUNULEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWZlLWFtZXJpY2EtZnJvbnRlbmQvLi9jb250ZXh0L0NhcnJpbmhvQ29udGV4dC50c3g/NTA2MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5cclxudHlwZSBDYXJyaW5ob0l0ZW0gPSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBxdWFudGlkYWRlOiBudW1iZXI7XHJcbn07XHJcblxyXG50eXBlIENhcnJpbmhvQ29udGV4dFR5cGUgPSB7XHJcbiAgY2FycmluaG86IENhcnJpbmhvSXRlbVtdO1xyXG4gIGFkaWNpb25hclByb2R1dG86IChpZDogc3RyaW5nKSA9PiB2b2lkO1xyXG4gIHJlbW92ZXJQcm9kdXRvOiAoaWQ6IHN0cmluZykgPT4gdm9pZDtcclxuICBsaW1wYXJDYXJyaW5obzogKCkgPT4gdm9pZDtcclxuICBhZGljaW9uYXJQcm9kdXRvUXVhbnRpZGFkZTogKGlkOiBzdHJpbmcsIHF1YW50aWRhZGU6IG51bWJlcikgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IENhcnJpbmhvQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8Q2FycmluaG9Db250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcclxuXHJcbmV4cG9ydCBjb25zdCBDYXJyaW5ob1Byb3ZpZGVyID0gKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IHtcclxuICBjb25zdCBbY2FycmluaG8sIHNldENhcnJpbmhvXSA9IHVzZVN0YXRlPENhcnJpbmhvSXRlbVtdPihbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBhcm1hemVuYWRvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnJpbmhvJyk7XHJcbiAgICBpZiAoYXJtYXplbmFkbykge1xyXG4gICAgICBzZXRDYXJyaW5obyhKU09OLnBhcnNlKGFybWF6ZW5hZG8pKTtcclxuICAgIH1cclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FycmluaG8nLCBKU09OLnN0cmluZ2lmeShjYXJyaW5obykpO1xyXG4gIH0sIFtjYXJyaW5ob10pO1xyXG5cclxuICBjb25zdCBhZGljaW9uYXJQcm9kdXRvID0gKGlkOiBzdHJpbmcpID0+IHtcclxuICAgIHNldENhcnJpbmhvKHByZXYgPT4ge1xyXG4gICAgICBjb25zdCBleGlzdGVudGUgPSBwcmV2LmZpbmQocCA9PiBwLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChleGlzdGVudGUpIHtcclxuICAgICAgICByZXR1cm4gcHJldi5tYXAocCA9PlxyXG4gICAgICAgICAgcC5pZCA9PT0gaWQgPyB7IC4uLnAsIHF1YW50aWRhZGU6IHAucXVhbnRpZGFkZSArIDEgfSA6IHBcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbLi4ucHJldiwgeyBpZCwgcXVhbnRpZGFkZTogMSB9XTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGFkaWNpb25hclByb2R1dG9RdWFudGlkYWRlID0gKGlkOiBzdHJpbmcsIHF1YW50aWRhZGU6IG51bWJlcikgPT4ge1xyXG4gICAgc2V0Q2FycmluaG8oKGNhcnJpbmhvQXR1YWwpID0+IHtcclxuICAgICAgY29uc3QgZXhpc3RlbnRlID0gY2FycmluaG9BdHVhbC5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gaWQpO1xyXG4gICAgICBpZiAoZXhpc3RlbnRlKSB7XHJcbiAgICAgICAgLy8gQXR1YWxpemEgYSBxdWFudGlkYWRlIGRvIHByb2R1dG8gasOhIGV4aXN0ZW50ZVxyXG4gICAgICAgIHJldHVybiBjYXJyaW5ob0F0dWFsLm1hcChpdGVtID0+XHJcbiAgICAgICAgICBpdGVtLmlkID09PSBpZFxyXG4gICAgICAgICAgICA/IHsgLi4uaXRlbSwgcXVhbnRpZGFkZTogaXRlbS5xdWFudGlkYWRlICsgcXVhbnRpZGFkZSB9XHJcbiAgICAgICAgICAgIDogaXRlbVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQWRpY2lvbmEgbm92byBwcm9kdXRvIGFvIGNhcnJpbmhvXHJcbiAgICAgICAgcmV0dXJuIFsuLi5jYXJyaW5ob0F0dWFsLCB7IGlkLCBxdWFudGlkYWRlIH1dO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW1vdmVyUHJvZHV0byA9IChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICBzZXRDYXJyaW5obyhwcmV2ID0+IHByZXYuZmlsdGVyKHAgPT4gcC5pZCAhPT0gaWQpKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBsaW1wYXJDYXJyaW5obyA9ICgpID0+IHtcclxuICAgIHNldENhcnJpbmhvKFtdKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPENhcnJpbmhvQ29udGV4dC5Qcm92aWRlclxyXG4gICAgICB2YWx1ZT17eyBjYXJyaW5obywgYWRpY2lvbmFyUHJvZHV0bywgcmVtb3ZlclByb2R1dG8sIGxpbXBhckNhcnJpbmhvLCBhZGljaW9uYXJQcm9kdXRvUXVhbnRpZGFkZSB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0NhcnJpbmhvQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZUNhcnJpbmhvID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KENhcnJpbmhvQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB0aHJvdyBuZXcgRXJyb3IoJ3VzZUNhcnJpbmhvIGRldmUgc2VyIHVzYWRvIGRlbnRybyBkZSBDYXJyaW5ob1Byb3ZpZGVyJyk7XHJcbiAgcmV0dXJuIGNvbnRleHQ7XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiQ2FycmluaG9Db250ZXh0IiwidW5kZWZpbmVkIiwiQ2FycmluaG9Qcm92aWRlciIsImNoaWxkcmVuIiwiY2FycmluaG8iLCJzZXRDYXJyaW5obyIsImFybWF6ZW5hZG8iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImFkaWNpb25hclByb2R1dG8iLCJpZCIsInByZXYiLCJleGlzdGVudGUiLCJmaW5kIiwicCIsIm1hcCIsInF1YW50aWRhZGUiLCJhZGljaW9uYXJQcm9kdXRvUXVhbnRpZGFkZSIsImNhcnJpbmhvQXR1YWwiLCJpdGVtIiwicmVtb3ZlclByb2R1dG8iLCJmaWx0ZXIiLCJsaW1wYXJDYXJyaW5obyIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VDYXJyaW5obyIsImNvbnRleHQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./context/CarrinhoContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_CarrinhoContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/context/CarrinhoContext */ \"./context/CarrinhoContext.tsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_CarrinhoContext__WEBPACK_IMPORTED_MODULE_2__.CarrinhoProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\gusta\\\\Projetos\\\\cafe-america-clone\\\\src\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\gusta\\\\Projetos\\\\cafe-america-clone\\\\src\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQStCO0FBRThCO0FBRTlDLFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNILHNFQUFnQkE7a0JBQ2YsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWZlLWFtZXJpY2EtZnJvbnRlbmQvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgeyBDYXJyaW5ob1Byb3ZpZGVyIH0gZnJvbSAnQC9jb250ZXh0L0NhcnJpbmhvQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPENhcnJpbmhvUHJvdmlkZXI+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9DYXJyaW5ob1Byb3ZpZGVyPlxuICApXG59Il0sIm5hbWVzIjpbIkNhcnJpbmhvUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();