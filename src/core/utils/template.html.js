export const htmlEmailToken = () => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div>
      <a href="{{link_verify}}">Link verify</a>
    </div>
  </body>
</html>
`;
};
