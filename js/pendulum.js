$(function () {
    // Canvas variables
    let canvas = document.getElementById("mainCanvas");
    let context = canvas.getContext("2d");
    let canvas_h = canvas.height;
    let canvas_w = canvas.width;
    let offsetX = canvas_w / 2;
    let offsetY = 210;
    context.translate(offsetX, offsetY);

    //Length of the two rods
    let rod1_l = 100;
    let rod_l2 = 100;

    //Mass of the two bobs
    let bob1_m = 10;
    let bob2_m = 10;

    //Amplitudes and angular velocity at the two pivot points
    let p1_amp = Math.PI / 2;
    let p2_amp = Math.PI / 2;
    let p1_vel = 0;
    let p2_vel = 0;
    let p1_acc = 0;
    let p2_acc = 0;

    //Gravitational constant
    let g = 1;

    function draw() {
        //Erasing the old content
        context.clearRect(0 - offsetX, 0 - offsetY, canvas_w, canvas_h);

        //calculate physics stuff i don't understand to update the amplitude
        let numerator = (-g * (2 * bob1_m + bob2_m) * Math.sin(p1_amp)) +
            (-bob2_m * g * Math.sin(p1_amp - 2 * p2_amp)) +
            (-2 * Math.sin(p1_amp - p2_amp) * bob2_m) * (p2_vel * p2_vel * rod_l2 + p1_vel * p1_vel * rod1_l * Math.cos(p1_amp - p2_amp));
        let denominator = rod1_l * (2 * bob1_m + bob2_m - bob2_m * Math.cos(2 * p1_amp - 2 * p2_amp));
        p1_acc = numerator / denominator;

        numerator = (2 * Math.sin(p1_amp - p2_amp)) * ((p1_vel * p1_vel * rod1_l * (bob1_m + bob2_m)) +
            (g * (bob1_m + bob2_m) * Math.cos(p1_amp)) + (p2_vel * p2_vel * rod_l2 * bob2_m * Math.cos(p1_amp - p2_amp)));

        denominator = rod_l2 * (2 * bob1_m + bob2_m - bob2_m * Math.cos(2 * p1_amp - 2 * p2_amp));
        p2_acc = numerator/denominator;

        //Calculate the current position of the bobs based on the amplitudes
        let x1 = rod1_l * Math.sin(p1_amp);
        let y1 = rod1_l * Math.cos(p1_amp);

        let x2 = x1 + rod_l2 * Math.sin(p2_amp);
        let y2 = y1 + rod_l2 * Math.cos(p2_amp);


        //Draw everything
        context.beginPath();
        context.moveTo(0, 0);

        context.lineTo(x1, y1);
        context.arc(x1, y1, bob1_m, 0, 2 * Math.PI);

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.arc(x2, y2, bob2_m, 0, 2 * Math.PI);
        context.stroke();

        p1_vel += p1_acc;
        p2_vel += p2_acc;

        p1_amp += p1_vel;
        p2_amp += p2_vel;
        console.log(p1_amp);
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);

});