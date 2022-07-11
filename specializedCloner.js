// container id is w-slider-mask-0
// each contained member is class team-block
// swap image is easy, name is h3, text is class team-member-text, link class is text-link-arrow > div
// image dimensions are 282×179.867

function main() {
  window.addEventListener("load", (event) => {
    console.log("window loaded, starting stuff");
    // first, grab the element in the container and clone it
    const section = document.querySelector("#w-slider-mask-0");
    for (let i = 0; i < 12; i++) {
      // then, append the cloned element to the end of the section
      const clone = section.children[0].cloneNode(true);

      // change h2 to Cloned ${i} and p to "This is the cloned element number ${i}"

      clone.querySelector("h3").innerHTML = `Cloned ${i + 1}`;
      clone.querySelector(
        ".team-member-text"
      ).innerHTML = `This is the cloned element number ${i + 1}`;
      clone.querySelector(".text-link-arrow > div").innerHTML = `Let clone ${
        i + 1
      } help you`;
      // change background color to red
      clone.style.backgroundColor = "red";
      // swap the image to https://source.unsplash.com/random/400x400
      clone.querySelector("img").src = `https://picsum.photos/id/${
        i * 14
      }/282/180`;

      section.appendChild(clone);
    }
    // hide first element
    section.children[0].style.display = "none";
  });
}

main();
