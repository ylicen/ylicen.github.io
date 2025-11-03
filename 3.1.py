from random import randint
from os import listdir
from PIL import Image

# 打开并读取其中的水印像素, 也就是那些不是白色背景的像素
# 读到内存中, 放到字典中以供快速访问
im = Image.open('fox.bmp')
width, height = im.size
pixels = dict()
for w in range(width):
    for h in range(height):
        c = im.getpixel((w,h))[:3]
        if c != (255, 255, 255):
            pixels[(w,h)] = c

def addWaterMark(srcDir):
    # 获取当前所有 BMP 图像文件列表
    picfiles = [fn for fn in listdir(srcDir)
                if fn.endswith(('.bmp', '.jpg', '.png'))]
    
    # 遍历所有文件, 为每个图像添加水印
    for fn in picfiles:
        im1 = Image.open(fn)
        w, h = im1.size
        
        # 如果图片尺寸小于水印图片, 不加水印
        if w < width or h < height:
            continue
            
        # 在原始图像左上角、中间或右下角添加数字水印
        # 具体位置根据 position 进行随机选择
        P = {0: (0, 0), 1: ((w-width)//2, (h-height)//2), 2: (w-width, h-height)}
        Position = randint(0, 2)
        top, left = P.get(Position, (0, 0))
        
        # 修改像素值, 添加水印
        for p, c in pixels.items():
            im1.putpixel((p[0]+top, p[1]+left), c)
            
        # 保存加入水印之后的新图像文件
        im1.save(fn[:-4] + '_new' + fn[-4:])

# 为当前文件夹中的图像文件添加水印
addWaterMark('.')
