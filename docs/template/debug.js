class RandomBackgroundColor {
    constructor(elementSelector) {
      this.elements = document.querySelectorAll(elementSelector);
      this.colors = ['#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#6d597a', '#e56b6f'];
    }
  
    getRandomColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
  
    applyRandomColor() {
      this.elements.forEach((element) => {
        const level = this.getLevel(element);
        if (level === 3) {
          element.style.backgroundColor = this.getRandomColor();
        }
      });
    }
  
    getLevel(element) {
      let level = 1;
      let parent = element.parentNode;
      while (parent !== null) {
        if (parent.tagName.toLowerCase() !== 'html') {
          level++;
          parent = parent.parentNode;
        } else {
          break;
        }
      }
      return level;
    }
  }

  export default RandomBackgroundColor;
  
  // Usage example:
  // const randomBgColor = new RandomBackgroundColor('.cover * ');
  // randomBgColor.applyRandomColor();
  