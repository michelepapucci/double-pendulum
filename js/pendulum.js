$(function () {
    const PATH_LENGTH_ON_SCREEN = 300;

    // Canvas variables
    let canvas = document.getElementById("mainCanvas");
    let context = canvas.getContext("2d");
    let canvas_h = canvas.height;
    let canvas_w = canvas.width;
    let offsetX = canvas_w / 2;
    let offsetY = canvas_h / 2;
    context.translate(offsetX, offsetY);

    //Length of the two rods
    let rod1_l = 100;
    let rod_l2 = 100;

    //Mass of the two bobs
    let bob1_m = 10;
    let bob2_m = 10;

    //Amplitudes, angular velocity and angular acceleration of the two bobs
    //TODO: maybe objectify bobs?
    let bob1_x = Math.PI / 2;
    let bob2_x = Math.PI / 2;
    let bob1_a_vel = 0;
    let bob2_a_vel = 0;
    let bob1_a_acc = 0;
    let bob2_a_acc = 0;
    let p_bob2_x = 0;
    let p_bob2_y = 0;

    //Gravitational constant
    let g = 1;

    //TODO: write a good comment
    let bob2_path = [{
        startX: bob2_x,
        startY: 0,
        endX: bob2_x,
        endY: 0
    }];

    //TODO: refactor to good variable names
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    function calc() {
        //calculate physics stuff i don't understand to update the amplitude
        let numerator = (-g * (2 * bob1_m + bob2_m) * Math.sin(bob1_x)) +
            (-bob2_m * g * Math.sin(bob1_x - 2 * bob2_x)) +
            (-2 * Math.sin(bob1_x - bob2_x) * bob2_m) * (Math.pow(bob2_a_vel,2)* rod_l2 + Math.pow(bob1_a_vel,2) * rod1_l * Math.cos(bob1_x - bob2_x));
        let denominator = rod1_l * (2 * bob1_m + bob2_m - bob2_m * Math.cos(2 * bob1_x - 2 * bob2_x));
        bob1_a_acc = numerator / denominator;

        numerator = (2 * Math.sin(bob1_x - bob2_x)) * ((Math.pow(bob1_a_vel,2) * rod1_l * (bob1_m + bob2_m)) +
            (g * (bob1_m + bob2_m) * Math.cos(bob1_x)) + (Math.pow(bob2_a_vel,2) * rod_l2 * bob2_m * Math.cos(bob1_x - bob2_x)));
        denominator = rod_l2 * (2 * bob1_m + bob2_m - bob2_m * Math.cos(2 * bob1_x - 2 * bob2_x));
        bob2_a_acc = numerator / denominator;

        //Calculate the current position of the bobs based on the amplitudes
        x1 = rod1_l * Math.sin(bob1_x);
        y1 = rod1_l * Math.cos(bob1_x);

        x2 = x1 + rod_l2 * Math.sin(bob2_x);
        y2 = y1 + rod_l2 * Math.cos(bob2_x);
    }

    function update(){
        //Update the variables for the next loop
        bob1_a_vel += bob1_a_acc;
        bob2_a_vel += bob2_a_acc;

        bob1_x += bob1_a_vel;
        bob2_x += bob2_a_vel;

        p_bob2_x = x2;
        p_bob2_y = y2;
    }

    function draw() {
        context.clearRect(0 - offsetX, 0 - offsetY, canvas_w, canvas_h);

        context.beginPath();
        for(let line of bob2_path){
            context.moveTo(line.startX, line.startY);
            context.lineTo(line.endX, line.endY);
            console.log(line);
            context.strokeStyle = "#CCCCCC";
            context.stroke();
            if(bob2_path.length > PATH_LENGTH_ON_SCREEN) {
                bob2_path.shift();
            }
        }
        context.closePath();

        calc();

        bob2_path.push({
            startX: p_bob2_x,
            startY: p_bob2_y,
            endX: x2,
            endY: y2
        });

        //Draw everything
        context.beginPath();
        context.moveTo(0, 0);

        context.lineTo(x1, y1);
        context.arc(x1, y1, bob1_m, 0, 2 * Math.PI);

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.arc(x2, y2, bob2_m, 0, 2 * Math.PI);
        context.strokeStyle = "#000000";
        context.stroke();
        context.closePath();

        update();

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);

});