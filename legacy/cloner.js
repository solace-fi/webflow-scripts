function main2() {
  // first, grab the element in this path: body > section > article (first child) and clone it
  const section = document.querySelector("body > section");
  for (let i = 0; i < 12; i++) {
    // then, append the cloned element to the end of the section
    const clone = section.children[0].cloneNode(true);

    // change h2 to Cloned ${i} and p to "This is the cloned element number ${i}"

    clone.querySelector("h2").innerHTML = `Cloned ${i + 1}`;
    clone.querySelector("p").innerHTML = `This is the cloned element number ${
      i + 1
    }`;
    // change background color to red
    clone.style.backgroundColor = "red";
    // swap the image to https://source.unsplash.com/random/400x400
    clone.querySelector("img").src = `https://picsum.photos/id/${i * 14}/400`;

    section.appendChild(clone);
  }
  // hide first element
  section.children[0].style.display = "none";
}

main2();
