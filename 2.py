import sys
from OpenGL.GL import *
from OpenGL.GLUT import *
from OpenGL.GLU import *

class MyPyOpenGLTest:
    def __init__(self, width=640, height=480, title=b'SolidTeapot'):
        glutInit(sys.argv)
        glutInitDisplayMode(GLUT_RGBA|GLUT_DOUBLE|GLUT_DEPTH)
        glutInitWindowSize(width, height)
        self.window = glutCreateWindow(title)
        glutDisplayFunc(self.Draw)

        # 指定键盘事件处理函数
        glutKeyboardFunc(self.KeyPress)
        glutIdleFunc(self.Draw)
        self.InitGL(width, height)
        # 绕各坐标轴旋转的角度
        self.x = 0.0
        self.y = 0.0
        self.z = 0.0
        # 缩放比例
        self.s = 1.0

    def KeyPress(self, key, x, y):
        # 根据不同的按键决定缩放比例和每个轴的旋转角度
        if key == b'a':
            self.x += 1
        elif key == b's':
            self.x -= 1
        elif key == b'j':
            self.y += 1
        elif key == b'k':
            self.y -= 1
        elif key == b'g':
            self.z += 1
        elif key == b'h':
            self.z -= 1
        elif key == b'x':
            self.s += 0.3
        elif key == b'w':
            self.s -= 0.3

    # 绘制图形
    def Draw(self):
        glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()
        # 平移
        glTranslatef(0.0, 0.0, -8.0)
        # 分别绕 x、y、z 轴旋转
        glRotatef(self.x, 1.0, 0.0, 0.0)
        glRotatef(self.y, 0.0, 1.0, 0.0)
        glRotatef(self.z, 0.0, 0.0, 1.0)
        # 各方向等比例缩放
        glScalef(self.s, self.s, self.s)
        # 绘制茶壶
        glColor3f(0.8, 0.3, 1.0)
        glutSolidTeapot(1.0)

        glutSwapBuffers()

    def InitGL(self, width, height):
        # 初始化窗口背景为白色
        glClearColor(1.0, 1.0, 1.0, 1.0)
        glClearDepth(1.0)
        glDepthFunc(GL_LESS)
        # 设置材质与光源属性
        mat_sp = (1.0, 1.0, 1.0, 1.0)
        mat_sh = [50.0]
        light_position = (-0.5, 1.5, 1.0)
        yellow_1 = (1, 0.7, 0, 1)
        ambient = (0.1, 0.8, 0.2, 1.0)

        glMaterialfv(GL_FRONT, GL_SPECULAR, mat_sp)
        glMaterialfv(GL_FRONT, GL_SHININESS, mat_sh)
        glLightfv(GL_LIGHT0, GL_POSITION, light_position)
        glLightfv(GL_LIGHT0, GL_DIFFUSE, yellow_1)
        glLightfv(GL_LIGHT0, GL_SPECULAR, yellow_1)
        glLightModelfv(GL_LIGHT_MODEL_AMBIENT, ambient)

        # 启用光照模型
        glEnable(GL_LIGHTING)
        glEnable(GL_LIGHT0)
        glEnable(GL_DEPTH_TEST)

        # 光滑渲染
        glEnable(GL_BLEND)
        glShadeModel(GL_SMOOTH)
        glEnable(GL_POINT_SMOOTH)
        glEnable(GL_LINE_SMOOTH)
        glEnable(GL_POLYGON_SMOOTH)

        glMatrixMode(GL_PROJECTION)
        # 反走样，也称为抗锯齿
        glHint(GL_POINT_SMOOTH_HINT, GL_NICEST)
        glHint(GL_LINE_SMOOTH_HINT, GL_NICEST)
        glHint(GL_POLYGON_SMOOTH_HINT, GL_FASTEST)
        glLoadIdentity()
        # 透视投影变换
        gluPerspective(45.0, width/height, 0.1, 100.0)
        glMatrixMode(GL_MODELVIEW)

    def MainLoop(self):
        glutMainLoop()

if __name__ == '__main__':
    w = MyPyOpenGLTest()
    w.MainLoop()
