import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

const FILES = [
  {
    file: '/home/protech/Belgaum_Gyms_Directory.xlsx',
    name: 'Belagavi Gyms',
    slug: 'belagavi-gyms',
    description: 'Public directory of gyms in Belagavi (Belgaum), Karnataka',
    color: 'orange',
    nameCol: 'Gym Name',
    localityCol: 'Locality',
    phoneCol: 'Mobile No',
    addressCol: 'Address'
  },
  {
    file: '/home/protech/Belgaum_Transport_Directory.xlsx',
    name: 'Belagavi Transport',
    slug: 'belagavi-transport',
    description: 'Public directory of transport services in Belagavi (Belgaum)',
    color: 'blue',
    nameCol: 'Company Name',
    localityCol: 'Locality',
    phoneCol: 'Mobile No',
    addressCol: 'Address'
  }
];

function readXlsx(file: string): Record<string, string>[] {
  const wb = XLSX.readFile(file);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
}

async function main() {
  for (const f of FILES) {
    console.log(`\n→ ${f.name}`);
    const rows = readXlsx(f.file);
    console.log(`  rows: ${rows.length}`);

    const pipeline = await prisma.pipeline.upsert({
      where: { slug: f.slug },
      update: { name: f.name, description: f.description, color: f.color },
      create: { name: f.name, slug: f.slug, description: f.description, color: f.color }
    });
    console.log(`  pipeline: ${pipeline.id}`);

    let created = 0;
    let skipped = 0;
    for (const r of rows) {
      const name = (r[f.nameCol] || r['Name'] || '').toString().trim();
      if (!name) {
        skipped++;
        continue;
      }
      const phone = (r[f.phoneCol] || r['Phone'] || '').toString().trim() || null;
      const locality = (r[f.localityCol] || r['Locality'] || '').toString().trim() || null;
      const address = (r[f.addressCol] || r['Address'] || '').toString().trim() || null;
      const source = (r['Source'] || 'Local Directory').toString().trim();
      const sourceUrl = (r['Source URL'] || r['Source Url'] || '').toString().trim() || null;

      // dedupe by name+locality+phone within the pipeline
      const existing = await prisma.lead.findFirst({
        where: { pipelineId: pipeline.id, name, phone, locality }
      });
      if (existing) {
        skipped++;
        continue;
      }
      await prisma.lead.create({
        data: {
          pipelineId: pipeline.id,
          name,
          phone,
          locality,
          address,
          city: 'Belagavi',
          source: source || 'Local Directory',
          sourceUrl: sourceUrl,
          status: 'new'
        }
      });
      created++;
    }
    console.log(`  created: ${created}, skipped: ${skipped}`);
  }
  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
