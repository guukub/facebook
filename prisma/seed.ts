import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding demo data...');

  // 1. Admin
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: 'admin123',
      },
    });
    console.log('Admin seeded.');
  }

  // 2. Properties
  const propCount = await prisma.property.count();
  if (propCount === 0) {
    await prisma.property.createMany({
      data: [
        {
          name: 'บ้านเดี่ยว ม.ชัยพฤกษ์ บางบอน',
          propertyType: 'บ้านเดี่ยว',
          price: 5500000,
          location: 'บางบอน',
          description: 'บ้านสวยพร้อมอยู่ 3 ห้องนอน 3 ห้องน้ำ พื้นที่ 60 ตร.ว. จอดรถได้ 2 คัน มีพื้นที่จัดสวนรอบบ้าน การเดินทางสะดวก ใกล้ห้างสรรพสินค้าและทางด่วน',
          sellingPoints: '- ใกล้ทางด่วนพระราม 2\n- สภาพใหม่ ไม่ค่อยได้อยู่\n- ฟรีแอร์ 3 ตัว',
          phone: '0812345678',
          lineId: 'teebangbon',
          images: '[]',
          status: 'พร้อมขาย',
        },
        {
          name: 'ทาวน์โฮม พฤกษา 74',
          propertyType: 'ทาวน์โฮม',
          price: 2100000,
          location: 'สมุทรปราการ',
          description: 'ทาวน์โฮม 2 ชั้น 3 ห้องนอน 2 ห้องน้ำ พื้นที่ 18 ตร.ว. ต่อเติมหลังคาโรงรถและห้องครัวหลังบ้านแล้ว พร้อมเข้าอยู่',
          sellingPoints: '- ใกล้รถไฟฟ้าสายสีเขียว\n- ต่อเติมครัวพร้อมใช้งาน',
          phone: '0812345678',
          lineId: 'teebangbon',
          images: '[]',
          status: 'พร้อมขาย',
        },
        {
          name: 'คอนโด ลุมพินี',
          propertyType: 'คอนโด',
          price: 1500000,
          location: 'บางแค',
          description: 'คอนโด ชั้น 8 วิวเมือง ห้องสตูดิโอ 26 ตร.ม. เฟอร์นิเจอร์ครบ (เตียง, ตู้, โซฟา, ทีวี, ตู้เย็น) พร้อมส่วนกลาง ฟิตเนส สระว่ายน้ำ',
          sellingPoints: '- ติดถนนใหญ่\n- ใกล้เดอะมอลล์บางแค\n- ส่วนกลางครบ',
          phone: '0812345678',
          lineId: 'teebangbon',
          images: '[]',
          status: 'พร้อมขาย',
        },
        {
          name: 'ที่ดิน บางบอน 5',
          propertyType: 'ที่ดิน',
          price: 12000000,
          location: 'บางบอน',
          description: 'ที่ดินเปล่า 2 ไร่ ถมแล้วบางส่วน เหมาะสำหรับสร้างโรงงานหรือโกดังสินค้า ถนนกว้างรถสิบล้อเข้าออกได้',
          sellingPoints: '- แปลงสวยสี่เหลี่ยม\n- เหมาะทำโกดัง',
          phone: '0812345678',
          lineId: 'teebangbon',
          images: '[]',
          status: 'พร้อมขาย',
        }
      ]
    });
    console.log('Properties seeded.');
  }

  // 3. Facebook Groups
  const groupCount = await prisma.facebookGroup.count();
  if (groupCount === 0) {
    await prisma.facebookGroup.createMany({
      data: [
        {
          name: 'บ้านมือสองกรุงเทพ',
          url: 'https://www.facebook.com/groups/example1',
          category: 'อสังหาริมทรัพย์',
          province: 'กรุงเทพ',
          memberCount: 150000,
          isActive: true,
        },
        {
          name: 'ซื้อขายบ้านนนทบุรี',
          url: 'https://www.facebook.com/groups/example2',
          category: 'อสังหาริมทรัพย์',
          province: 'นนทบุรี',
          memberCount: 85000,
          isActive: true,
        },
        {
          name: 'บ้านราคาดี',
          url: 'https://www.facebook.com/groups/example3',
          category: 'อสังหาริมทรัพย์',
          province: 'ทั่วประเทศ',
          memberCount: 200000,
          isActive: true,
        },
        {
          name: 'ลงฟรีอสังหา',
          url: 'https://www.facebook.com/groups/example4',
          category: 'อสังหาริมทรัพย์',
          province: 'ทั่วประเทศ',
          memberCount: 300000,
          isActive: true,
        },
        {
          name: 'ลงประกาศบ้าน',
          url: 'https://www.facebook.com/groups/example5',
          category: 'อสังหาริมทรัพย์',
          province: 'ทั่วประเทศ',
          memberCount: 120000,
          isActive: true,
        }
      ]
    });
    console.log('Groups seeded.');
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
