function sleep(ms: number) {
  return new Promise<number>((resolve) =>
    setTimeout(() => {
      return resolve(12);
    }, ms)
  );
}

function a() {
  console.log("a");
}
async function b() {
  await sleep(2000);
  console.log("b");
}

async function main(x: number) {
  if (x == 1) {
    a();
    [1, 2, 3, 4, 5, 6].forEach(async () => {
      console.log("promise");
      await b().then(() => console.log("success"));
      console.log("double success");
    });
    a();
  }
  if (x == 2) {
    await b();
    a();
    a();
  }
  if (x == 3) {
    b();
    a();
    a();
  }
}

console.log("b() without await");
await main(3);
await sleep(1999);
console.log("b() with await");
await main(2);
console.log("b() within .foreach loop and then");
await main(1);
