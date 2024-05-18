class Node {
    constructor(value, x = 300, y = 20) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = x;
        this.y = y;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.nodeDistance = 300;  // Ajuste conforme necessário para melhor visualização
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    updateHeight(node) {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    rotateRight(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateHeight(y);
        this.updateHeight(x);
        return x;
    }

    rotateLeft(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateHeight(x);
        this.updateHeight(y);
        return y;
    }

    insert(node, value, x, y, level = 1) {
        if (!node) return new Node(value, x, y);
        if (value < node.value) {
            node.left = this.insert(node.left, value, x - this.nodeDistance / (level + 1.5), y + 60, level + 1);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value, x + this.nodeDistance / (level + 1.5), y + 60, level + 1);
        } else {
            return node;  // Duplicate values not allowed
        }
        this.updateHeight(node);
        return this.balance(node, value);
    }

    balance(node, value) {
        let balance = this.getBalanceFactor(node);
        // Right Rotation
        if (balance > 1 && value < node.left.value) {
            return this.rotateRight(node);
        }
        // Left Rotation
        if (balance < -1 && value > node.right.value) {
            return this.rotateLeft(node);
        }
        // Left-Right Rotation
        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        // Right-Left Rotation
        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }
        return node;
    }

    add(value) {
        this.root = this.insert(this.root, value, window.innerWidth / 2, 20);
        this.updateView();
    }

    updateView() {
        const canvas = document.getElementById('avlCanvas');
        if (canvas.getContext) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawNode(this.root, context);
        }
    }

    drawNode(node, context) {
        if (node !== null) {
            if (node.left !== null) {
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(node.left.x, node.left.y);
                context.stroke();
            }
            if (node.right !== null) {
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(node.right.x, node.right.y);
                context.stroke();
            }
            context.beginPath();
            context.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(node.value, node.x, node.y + 6);
            context.fillText(`H:${node.height} B:${this.getBalanceFactor(node)}`, node.x, node.y - 30); // Mostra altura e balanceamento
            context.fillStyle = "black";

            this.drawNode(node.left, context);
            this.drawNode(node.right, context);
        }
    }
}

const avl = new AVLTree();
function addValue() {
    const value = parseInt(document.getElementById('valueInput').value);
    if (!isNaN(value)) {
        avl.add(value);
        document.getElementById('valueInput').value = '';
    } else {
        alert('Please enter a valid number.');
    }
}

window.onload = function() {
    const canvas = document.getElementById('avlCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
};
