module.exports = () => {
  // this function return a random isbn number i.e 978-3-16-148410-0
  let isbn = "";

  for (let i = 1; i <= 3; i++) {
    isbn += Math.floor(Math.random() * 10);
  }
  isbn += "-";

  for (let i = 1; i <= 1; i++) {
    isbn += Math.floor(Math.random() * 10);
  }
  isbn += "-";

  for (let i = 1; i <= 2; i++) {
    isbn += Math.floor(Math.random() * 10);
  }
  isbn += "-";

  for (let i = 1; i <= 6; i++) {
    isbn += Math.floor(Math.random() * 10);
  }
  isbn += "-";

  for (let i = 1; i <= 1; i++) {
    isbn += Math.floor(Math.random() * 10);
  }

  return isbn;
};
