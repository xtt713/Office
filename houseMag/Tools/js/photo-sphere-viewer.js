function panorama_cxy() {
    this.camera,
    this.scene,
    this.renderer,
    this.isUserInteracting = false,
    this.onMouseDownMouseX = 0,
    this.onMouseDownMouseY = 0,
    this.lon = 0,
    this.onMouseDownLon = 0,
    this.lat = 0,
    this.onMouseDownLat = 0,
    this.phi = 0,
    this.theta = 0,
    this.onMouseMoveX = 0,
    this.onMOuseMoveY = 0,
    this.meshObj = undefined;
}

panorama_cxy.prototype = {

    //初始化函数
    init: function (div, img) {

        if (THREE.Cache.files) {
            THREE.Cache.clear();
        }
        var that = this;
        that.isUserInteracting = false,
        that.onMouseDownMouseX = 0,
        that.onMouseDownMouseY = 0,
        that.lon = 0,
        that.onMouseDownLon = 0,
        that.lat = 0,
        that.onMouseDownLat = 0,
        that.onMouseMoveX = 0,
        that.onMouseMoveY = 0,
        that.phi = 0,
        that.meshObj = undefined,
        that.theta = 0;
        //bautorun为true时，全景图片会自动旋转
        that.bautorun = false;

        var container, mesh, controls;
        container = document.getElementById(div);
        //创建透视相机(可视角度，长宽比，近距离，远距离)
        that.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);
        //相机对象为三维对象向量
        that.camera.target = new THREE.Vector3(0, 0, 0);
        //创建场景
        that.scene = new THREE.Scene();
        //创建几何物体
        var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        //几何物体材质 MeshBasicMaterial对光照无感，给几何体一种简单的颜色
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(img)
        });

        mesh = new THREE.Mesh(geometry, material);
        that.meshObj = that.scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);//设置canvas的像素比为当前屏幕像素比，避免高分屏下模糊
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        //controls = new THREE.TrackballControls(that.camera,renderer.domElement); 
        container.addEventListener('mousedown', onDocumentMouseDown, false);
        container.addEventListener('mousemove', onDocumentMouseMove, false);
        container.addEventListener('mouseup', onDocumentMouseUp, false);
        container.addEventListener('touchstart', onDocumentMouseDown, false);
        container.addEventListener('touchmove', onDocumentMouseMove, false);
        container.addEventListener('touchend', onDocumentMouseUp, false);
        container.addEventListener('wheel', onDocumentMouseWheel, false);
        container.addEventListener('dragover', function (event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }, false);

        container.addEventListener('dragenter', function (event) {
            container.body.style.opacity = 0.5;
        }, false);

        container.addEventListener('dragleave', function (event) {
            container.body.style.opacity = 1;
        }, false);

        container.addEventListener('drop', function (event) {
            event.preventDefault();
            var reader = new FileReader();
            reader.addEventListener('load', function (event) {
                material.map.image.src = event.target.result;
                material.map.needsUpdate = true;
            }, false);
            reader.readAsDataURL(event.dataTransfer.files[0]);
            container.body.style.opacity = 1;
        }, false);

        window.addEventListener('resize', onWindowResize, false);

        animate();


        function onWindowResize() {
            that.camera.aspect = window.innerWidth / window.innerHeight;
            that.camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        function onDocumentMouseDown(event) {
            event.preventDefault();
            that.isUserInteracting = true;
            onMouseDownMouseX = event.clientX || event.changedTouches[0].clientX;
            onMouseDownMouseY = event.clientY || event.changedTouches[0].clientY;
            onMouseDownLon = that.lon;
            onMouseDownLat = that.lat;
        }

        function onDocumentMouseMove(event) {
            if (that.isUserInteracting === true) {
                onMouseMoveX = event.clientX || event.changedTouches[0].clientX;
                onMouseMoveY = event.clientY || event.changedTouches[0].clientY;
                that.lon = (onMouseDownMouseX - onMouseMoveX) * 0.1 + onMouseDownLon;
                that.lat = (onMouseMoveY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
                //alert("111");
            }
        }

        function onDocumentMouseUp(event) {
            that.isUserInteracting = false;
        }

        function onDocumentMouseWheel(event) {
            var fov = that.camera.fov + event.deltaY * 0.05;
            that.camera.fov = THREE.Math.clamp(fov, 10, 75);
            that.camera.updateProjectionMatrix();
            
        }

        function animate() {
            requestAnimationFrame(animate);
            update();
        }

        function update() {
            if (that.isUserInteracting === false && that.bautorun === true) {
                that.lon += 0.002;
            }
            that.lat = Math.max(-85, Math.min(85, that.lat));
            that.phi = THREE.Math.degToRad(90 - that.lat);
            that.theta = THREE.Math.degToRad(that.lon);

            that.camera.target.x = 500 * Math.sin(that.phi) * Math.cos(that.theta);
            that.camera.target.y = 500 * Math.cos(that.phi);
            that.camera.target.z = 500 * Math.sin(that.phi) * Math.sin(that.theta);
            that.camera.lookAt(that.camera.target);
            renderer.render(that.scene, that.camera);
        }
    },

    setAutorun: function (bauto) {
        this.bautorun = bauto;
    },

    changeImg: function (div, img) {
        var that = this;
        //创建场景
        that.scene = new THREE.Scene();
        var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        //几何物体材质
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(img)
        });

        mesh = new THREE.Mesh(geometry, material);
        that.scene.children[0].Mesh = mesh;
        //mesh = new THREE.Mesh(geometry, material);



    }

};