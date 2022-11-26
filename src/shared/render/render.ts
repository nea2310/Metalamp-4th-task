const componentsPaths = require.context('../../components/', true, /.*\.ts$/).keys();
const componentsNamesFiltered = componentsPaths.filter((component) => component.match(/^\.\/([\w-]*)\/([A-Z])/));
const componentsNames = componentsNamesFiltered.map((componentName) => {
  const result = componentName.match(/^\.\/([\w-]*)\/([\w]*)/);
  return result ? {
    path: `${result[1]}/${result[2]}`, componentSelector: result[1],
  } : {};
});

function render(page: Element, pageSelector: string) {
  componentsNames.forEach((componentName) => {
    const { componentSelector, path } = componentName;
    const wrappers = page.querySelectorAll(`${pageSelector}__${componentSelector}`);

    if (wrappers.length) {
      import(`../../components/${path}.ts`)
        .then((object) => {
          wrappers.forEach((wrapper) => {
            const component = wrapper.querySelector(`.js-${componentSelector}`);

            if (component) {
              const ClassObject = object.default;
              return new ClassObject(component);
            }
            return null;
          });
        })
        .catch((error) => {
          /* правило деактивировано, т.к. применяется стандартный
          способ обработки ошибки - вывод сообщения в консоль */
          // eslint-disable-next-line no-console
          console.warn(error, `: could not load component ${componentSelector}`);
        });
    }
  });
}

export default render;
