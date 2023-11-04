class Rectangle:
    def __init__(self, width , height ):
        self.width = width
        self.height = height

    def set_width(self, width):
        self.width=width
        return True

    def set_height(self, height):
        self.height=height
        return True

    def get_area(self):
        return self.width * self.height

    def get_perimeter(self):
        return 2 * self.width + 2 * self.height

    def get_diagonal(self):
        return (self.width ** 2 + self.height ** 2) ** .5

    def get_picture(self):
        picture = ''

    if(self.height > 50 or self.width > 50):
        return 'Too big for picture.'

    for i in range (0, self.height, 1):
        for i in range (0, self.width, 1):
            picture +='*'
        picture +='\n'
    
    return picture

    def get_amount_inside(self, shape):
        return (self.width//shape.width ) * (self.height//shape.height)

    def __str__(self):
        return 'Rectangle(width=' + str(self.width) + ', height=' + str(self.height) + ')'

class Square(Rectangle):

    def __init__(self, side):
        self.width = side 
        self.height = side 

    def set_side(self, side):
        self.width = side 
        self.height = side 
        return True

    def set_width(self, side):
        self.width = side 
        self.height = side 
        return True

    def set_height(self, side):
        self.width = side 
        self.height = side 
        return True

    def __str__(self):
        return 'Square(side=' + str(self.width) +')'
    